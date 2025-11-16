'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  ThumbsUp,
  AlertCircle,
  Heart,
  Plus,
  MessageSquare,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { ReviewVersion, ReviewComment, ReviewStatus, CommentType } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';
import toast from 'react-hot-toast';

interface ClientReviewPortalProps {
  projectId: string;
}

export function ClientReviewPortal({ projectId }: ClientReviewPortalProps) {
  const { reviewVersions, setReviewVersions, addReviewVersion, updateReviewVersion } =
    usePostProductionStore();
  const [activeTab, setActiveTab] = useState('');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTimecode, setNewTimecode] = useState('');
  const [commentType, setCommentType] = useState<CommentType>('change');
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionUrl, setNewVersionUrl] = useState('');

  const versions = reviewVersions[projectId] || [];

  useEffect(() => {
    loadReviewVersions();
  }, [projectId]);

  useEffect(() => {
    if (versions.length > 0 && !activeTab) {
      setActiveTab(versions[0].id);
    }
  }, [versions]);

  const loadReviewVersions = async () => {
    const { data: versionsData, error: versionsError } = await supabase
      .from('review_versions')
      .select('*')
      .eq('project_id', projectId)
      .order('upload_date', { ascending: false });

    if (versionsError) {
      console.error('Error loading versions:', versionsError);
      return;
    }

    if (versionsData && versionsData.length > 0) {
      const { data: commentsData } = await supabase
        .from('review_comments')
        .select('*')
        .in(
          'review_version_id',
          versionsData.map((v: any) => v.id)
        )
        .order('created_at', { ascending: false });

      const loadedVersions: ReviewVersion[] = versionsData.map((version: any) => ({
        id: version.id,
        projectId: version.project_id,
        versionName: version.version_name,
        fileUrl: version.file_url,
        fileSize: version.file_size,
        resolution: version.resolution,
        duration: version.duration,
        uploadDate: new Date(version.upload_date),
        status: version.status as ReviewStatus,
        approvedDate: version.approved_date ? new Date(version.approved_date) : undefined,
        comments:
          commentsData
            ?.filter((c: any) => c.review_version_id === version.id && !c.parent_comment_id)
            .map((comment: any) => ({
              id: comment.id,
              reviewVersionId: comment.review_version_id,
              timecode: comment.timecode,
              comment: comment.comment,
              commentType: comment.comment_type as CommentType,
              resolved: comment.resolved,
              commenterName: comment.commenter_name || 'Client',
              parentCommentId: comment.parent_comment_id,
              createdAt: new Date(comment.created_at),
              updatedAt: new Date(comment.updated_at),
            })) || [],
        createdAt: new Date(version.created_at),
        updatedAt: new Date(version.updated_at),
      }));

      setReviewVersions(projectId, loadedVersions);
    }
  };

  const handleAddVersion = async () => {
    if (!newVersionName.trim()) {
      toast.error('Please enter a version name');
      return;
    }

    const { data, error } = await supabase
      .from('review_versions')
      .insert({
        project_id: projectId,
        version_name: newVersionName,
        file_url: newVersionUrl || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding version:', error);
      toast.error('Failed to add version');
      return;
    }

    const newVersion: ReviewVersion = {
      id: data.id,
      projectId: data.project_id,
      versionName: data.version_name,
      fileUrl: data.file_url,
      uploadDate: new Date(data.upload_date),
      status: data.status as ReviewStatus,
      comments: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    addReviewVersion(projectId, newVersion);
    setShowUploadDialog(false);
    setNewVersionName('');
    setNewVersionUrl('');
    toast.success('Version added successfully');
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeTab) return;

    const { data, error } = await supabase
      .from('review_comments')
      .insert({
        review_version_id: activeTab,
        timecode: newTimecode || null,
        comment: newComment,
        comment_type: commentType,
        resolved: false,
        commenter_name: 'Client',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return;
    }

    await loadReviewVersions();
    setShowFeedbackDialog(false);
    setNewComment('');
    setNewTimecode('');
    toast.success('Feedback added');
  };

  const handleUpdateStatus = async (versionId: string, status: ReviewStatus) => {
    const { error } = await supabase
      .from('review_versions')
      .update({ status, approved_date: status === 'approved' ? new Date().toISOString() : null })
      .eq('id', versionId);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      return;
    }

    updateReviewVersion(projectId, versionId, {
      status,
      approvedDate: status === 'approved' ? new Date() : undefined,
    });
    toast.success(`Version ${status === 'approved' ? 'approved' : 'marked for revision'}`);
  };

  const handleToggleResolved = async (commentId: string, currentResolved: boolean) => {
    const { error } = await supabase
      .from('review_comments')
      .update({ resolved: !currentResolved })
      .eq('id', commentId);

    if (error) {
      console.error('Error toggling resolved:', error);
      toast.error('Failed to update comment');
      return;
    }

    await loadReviewVersions();
    toast.success(currentResolved ? 'Comment reopened' : 'Comment resolved');
  };

  const activeVersion = versions.find((v) => v.id === activeTab);

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'needs-revision':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCommentTypeIcon = (type: CommentType) => {
    switch (type) {
      case 'compliment':
        return <Heart className="h-4 w-4 text-green-400" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text">Client Review Portal</CardTitle>
          <Button size="sm" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            New Version
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {versions.length === 0 ? (
          <div className="text-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No review versions uploaded yet</p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload First Version
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-card border-white/10">
              {versions.map((version) => (
                <TabsTrigger key={version.id} value={version.id}>
                  {version.versionName}
                </TabsTrigger>
              ))}
            </TabsList>

            {versions.map((version) => (
              <TabsContent key={version.id} value={version.id} className="space-y-4">
                <div className="glass-card p-4">
                  <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-4">
                    {version.fileUrl ? (
                      <iframe
                        src={version.fileUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    ) : (
                      <div className="text-center">
                        <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Video player placeholder
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(version.status)} border`}>
                          {version.status.replace('-', ' ')}
                        </Badge>
                        {version.resolution && (
                          <span className="text-sm text-muted-foreground">{version.resolution}</span>
                        )}
                        {version.duration && (
                          <span className="text-sm text-muted-foreground">{version.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {version.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {version.status !== 'approved' && (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus(version.id, 'approved')}
                          className="flex-1"
                        >
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(version.id, 'needs-revision')}
                          variant="outline"
                          className="flex-1"
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Request Revisions
                        </Button>
                      </>
                    )}
                    {version.status === 'approved' && (
                      <Button
                        onClick={() => handleUpdateStatus(version.id, 'pending')}
                        variant="outline"
                        className="flex-1"
                      >
                        Reopen for Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Client Feedback</h4>
                    <Button size="sm" onClick={() => setShowFeedbackDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Feedback
                    </Button>
                  </div>

                  {version.comments && version.comments.length > 0 ? (
                    <div className="space-y-3">
                      {version.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3 rounded-lg ${
                            comment.resolved ? 'bg-white/5' : 'bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {getCommentTypeIcon(comment.commentType)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {comment.timecode && (
                                  <Badge variant="outline" className="text-xs">
                                    {comment.timecode}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {comment.commenterName}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{comment.comment}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleResolved(comment.id, comment.resolved)}
                                className="h-6 text-xs"
                              >
                                {comment.resolved ? (
                                  <>
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Resolved
                                  </>
                                ) : (
                                  'Mark Resolved'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No feedback yet
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="gradient-text">Add Feedback</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Timecode (optional)
                </label>
                <input
                  type="text"
                  placeholder="2:35"
                  value={newTimecode}
                  onChange={(e) => setNewTimecode(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Feedback Type</label>
                <div className="flex gap-2">
                  <Button
                    variant={commentType === 'change' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCommentType('change')}
                    className="flex-1"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                  <Button
                    variant={commentType === 'suggestion' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCommentType('suggestion')}
                    className="flex-1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Suggestion
                  </Button>
                  <Button
                    variant={commentType === 'compliment' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCommentType('compliment')}
                    className="flex-1"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Compliment
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Comment</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter your feedback..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <Button onClick={handleAddComment} className="w-full">
                Add Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="gradient-text">Upload New Version</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Version Name</label>
                <input
                  type="text"
                  placeholder="V1, V2, Final, etc."
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Video URL (optional - YouTube/Vimeo embed)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={newVersionUrl}
                  onChange={(e) => setNewVersionUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded"
                />
              </div>

              <Button onClick={handleAddVersion} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Version
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
