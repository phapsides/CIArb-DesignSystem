Provides a consistent wrapper for content images.

## When to use this component

For images that are content related.

## When to consider something else

For purely presentational imagery, consider background images or other CSS methods before resorting to the Image component.

For iconography, use the [Icon]({{ '/components/detail/icon' | path }}) component.

## Guidance

The component will stretch the width of the image to fill the width of the component. Apply any styles that manipulate the size of the image to the containing element, not the image itself.

## Accessibility

Images should always, _always_ have `alt` text. Alt text should describe the content of the image, not the function of the image.

## Browser considerations

Images by default utilise browser lazyloading, which is currently [only supported by a subset of browsers](https://caniuse.com/#feat=loading-lazy-attr). Non-supporting browsers will attempt to load images immediately.
