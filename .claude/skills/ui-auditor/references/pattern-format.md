# Pattern Entry Format

When appending new patterns to `tasks/ui-patterns.md`, use this format:

```markdown
## [Pattern Name]
- **Description**: What this pattern is and what it solves
- **When to use**: Scenarios where this pattern applies
- **Implementation**: Component/class names, props, variants to use
- **Example**:
  ```tsx
  // Concrete code example
  ```
- **Accessibility Notes**: Required ARIA attributes, keyboard behavior, focus management
```

## Example Entry

```markdown
## Destructive Action Button
- **Description**: Button style for irreversible or dangerous actions (delete, remove, revoke)
- **When to use**: Any action that permanently removes data or cannot be undone
- **Implementation**: Use `<Button variant="destructive">` from ShadCN. Always pair with a confirmation dialog for bulk or critical operations.
- **Example**:
  ```tsx
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">
        <Trash2 /> Delete Record
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  ```
- **Accessibility Notes**: Confirmation dialog must trap focus and return focus to trigger on close. Use `aria-describedby` for the warning message.
```

## Guidelines

- One pattern per `##` heading
- Keep descriptions concise — focus on when and how, not theory
- Always include a concrete code example from the project's stack
- Accessibility notes are mandatory, even if brief
- Do not duplicate patterns that already exist in the file
