The Grid is a utility component that lays out child element into a two-dimensional grid. It's very suited to cards and other components with a common, shared layout, and where there is potential to be an unlimited number of them.

Compare to the [Stack]({{ '/components/detail/stack' | path }}) component, which lay out a limited number of items in a one-dimensional column or row.

## When to use this component

To lay out a list of cards in a grid pattern.

## When to consider something else

To lay out a list of cards in a single row or column, use the [Stack]({{ '/components/detail/stack' | path }}) component.

If you need to lay out information in a manner other than what the Grid component specifies, do not use the Grid component.

## Guidance

The Grid component lays out cards based on the minimum and maximum width that the cards may be displayed at. As such, the number of columns and rows the Grid produces is variable and dependent on the grid configuration.

## Accessibility

The Grid does not have any inherent accessibility features. The Grid maintains the same reading order and logical order when compositing the layout.

## Browser considerations

Internet Explorer does not support the [CSS Grid Layout](https://caniuse.com/#feat=css-grid) features that the Grid component uses, and this lack of support cannot be polyfilled.

Instead, IE is served a similar-but-different flexbox implementation of the Grid. There are numerous necessary implementation differences between the two approaches, which limits how the Grid can be used.

| Component                     | Standard-based grid                                         | IE fallback                                        |
| :---------------------------- | :---------------------------------------------------------- | :------------------------------------------------- |
| Child element sizing          | Sized according to `minmax` property of grid configuration. | Sized as a percentage of the Grid container width. |
| No. of columns constrained by | Width of the Grid container.                                | Width of the browser viewport.                     |
| Potential max. no. of columns | Unlimited.                                                  | 4.                                                 |
