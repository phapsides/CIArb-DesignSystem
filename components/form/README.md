Forms are the most common method of gaining information, input and feedback from users.

## When to use this component

When you need to collect any quantity of information directly from the user.

## When to consider something else

Forms are often a barrier to the user's end goal. If you can get the information through means other than a form, that may be the preferred route.

## Guidance

Forms are a barrier to the user getting the information or outcome they want. To prevent frustration, put a lot of effort into making them concise and easy to understand.

Use the technologies available to you to simplify forms. For example, if you can determine a person's location from their IP address or the Geolocation API, do that instead of asking for the information. You should still provide a manual fallback however, in case the automatically determined information is incorrect.

Similarly, use pre-existing knowledge to simplify forms. If the user has an address already on file, consider pre-filling forms that ask for it—or skip those steps entirely—rather than asking for it again.

## Accessibility

Forms can often be a significant barrier for the elderly and people with disabilities, particularly people who cannot type quickly or have injuries related to the wrists and hands.

If possible, provide a non-form alternative to achieving a process, to accommodate people with significant disabilities or who are inexperienced using online forms. For example, allowing users to call a customer helpline to complete the transaction instead. This also comes in useful for users who encounter problems (either technical or informational) with the form to gain assistance.

Some screen readers have a forms-specific interaction mode (called forms mode in JAWS and focus mode in NVDA) that behaves differently from the standard browse mode. In browse mode, user interactions are mapped to keyboard keys (for example, navigating through the page with arrow keys, activating macros with certain keypresses, etc.). In forms mode, these keyboard keys act a more akin to a non-screen reader experience (arrow keys move within an input or group of radios, keypresses typing letters, etc).

You can improve the experience for screen reader users by following the accessibility guidelines set out on each form component. Particularly in making sure that every input has a unique label that has paired `for`/`id` attributes and using `aria-describedby` to link hints and error messaging to the input.

## Browser considerations

See each form component for information on browser support.

Not all form validation types are available in every browser, or work in exactly the same way. Notably:

- `badInput`
  - For the number and various date type inputs, browsers may return an error or clear the value of the input rather than returning a `badInput` validation.
- `tooLong`
  - Edge, Firefox and Safari all prevent the user entering more characters than `maxlength` specifies. However the input can be pre-populated or programatically changed to contain longer strings, which these browsers will not validate correctly.
- `tooShort`
  - Not supported in any version of Internet Explorer.
  - Firefox and Safari only validate input that has been modified, and do not validate pre-populated values that are shorter than `minlength`.
- `typeMismatch`
  - Firefox does not activate this validation for telephone numbers. Tel inputs allow plain text.
- `required`
  - Checkboxes have an indeterminate state in addition to being checked or unchecked. In validation, the indeterminate state is considered the same as being unchecked.
  - If a group of radio buttons have the required attribute on them, only one of the radio buttons needs to be checked to pass validation. This is not the case for checkboxes, where adding the required attribute will require all checkboxes to be selected.
  - It is not possible to set colour or range inputs to be empty. These will reset to a default value if pre-populated or programmatically changed to an empty value.
