Alerts inform users of important—and sometimes time-sensitive—changes.

## When to use this component

As a notification that keeps users informed of the state of the system, and which may or may not require the user to respond.

As a validation message that alerts the user that something needs to be corrected.

As confirmation that a task was completed successfully.

## When to consider something else

On forms, always include inline validation in addition to any error messages that appear at the top of the form.

If an action will result in destroying a user’s work (for example, deleting an application) use a more intrusive pattern, such as a confirmation Dialog, to allow the user to explicitly confirm their course of action.

## Guidance

When the user needs to perform an action in response to an Alert, let them know what they need to do and make that task as easy as possible. Write the message in concise, human readable language; avoid jargon and computer code.

Don’t overdo it. Too many Alerts will either overwhelm or annoy the user and are likely to be ignored.

Allow a user to dismiss an Alert wherever appropriate.

Don’t show Alerts that aren’t related to the user’s current goal.

## Accessibility

If the message is dynamically updated or populated (e.g. it is inserted by front-end validation) then it should have the `role="alert"` property included. This will cause screen readers to immediately read out the text in the Alert, and any future changes to that text. The Alert should not take focus away from other elements, and the user should still be able to interact with the entire page.

If the user is required to dismiss the Alert as quickly as possible (e.g. their session is about to expire, and they need to click a button to continue it) then use the `role="alertdialog"` property instead. In this instance, the user's focus _should_ be moved to the Alert, and the user may be prevented from continuing to interact with the page.

## Browser considerations

None.
