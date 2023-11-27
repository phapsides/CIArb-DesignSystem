A Description List shows a set of key/value pairs, suitable for metadata, summaries and reviews.

Unlike most components, the Description List is made up of two components—a parent component that acts as the wrapper for the whole Description List, and a child component that makes up the individual list items. Be aware of this when checking the parameter documentation.

## When to use this component

For showing a list of information as key/value pairs. For example, summarising a user's responses at the end of a form.

## When to consider something else

Only use the Description List for information that has both a key and at least one value.

Do not use for lists or tabular data. Use the appropriate HTML element for those situations.

## Guidance

A list item **must** always have one key and at least one value.

The `wide` variant collapses to a single stacked column on narrower screens.

## Accessibility

The Description List is marked up with `dl`/`dt`/`dd` elements, befitting the semantics of the Description List.

## Browser considerations

None.
