The Date Input allows users to provide a date.

## When to use this component

When the expected input is a memorable date, such as a date of birth.

When the expected input is more than a few months in the past or future.

## When to consider something else

If the expected input is close to the current day, consider using a [Datepicker]({{ '/components/detail/datepicker' | path }}).

If asking for a date from a specific document, such as a credit card, make the inputs match the format of the document.

## Guidance

Be sure to provide an example of how dates should be formatted. Ensure that examples make it obvious which part is the day component and which is the month component by making the month 9 or less, and day 13 or more. For example, 22 9 1991.

When validating, do not require the existence of a leading zero for the input to be valid. Ideally, validate the date as a single entity rather than as three individual inputs.

## Accessibility

Ensure that each individual input within the Date Input has its own label, indicating which part of the date it expects.

If the value the input is intended to have is known, use `autocomplete` attributes to indicate this to assistive technologies.

## Browser considerations

None.
