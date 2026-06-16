🧪 Add tests for projectsService.update

🎯 **What:**
Added unit tests for the `update` method in `projectsService` to cover a previously missing testing gap.

📊 **Coverage:**
- Happy path testing: Verifies `fetch` is correctly called with the appropriate ID in the URL (`/api/projects/:id`), HTTP method (`PUT`), and headers. Checks if the response correctly maps the returned snake_case data into camelCase format for the `Project` model.
- Error handling testing: Verifies the service correctly throws an error with the expected message when the server returns a non-ok response.

✨ **Result:**
Increased test coverage for `lib/services/projects-service.ts` allowing more robust and reliable project update operations, which makes the code safer against future regressions or modifications.
