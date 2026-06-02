# Workflow

1. Run `npm run check-env`.
2. Start Edge CDP with `npm run start-edge-cdp` if CDP is unavailable.
3. Manually sign in and open the target Google Skills course/lab in the temporary Edge profile.
4. Run `npm run inspect-tabs` to find the target tab.
5. Run `npm run inspect-page` and `npm run extract-course-state`.
6. Review hard stops before running any safe action.
7. Use `npm run click-by-text -- --text "Next" --execute` only for actions classified as allowed.
8. Append checkpoints to notes after each completed lesson/lab section.
