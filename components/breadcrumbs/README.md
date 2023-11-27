Breadcrumbs help users to understand where they are within a website hierarchy, and allow them to move between levels of that hierarchy.

## When to use this component

When you need to help users understand and move between the levels of the websie.

## When to consider something else

Do not use to indicate progress through a journey or transaction. Create a wizard or progress component for that purpose.

If the hierarchy can be determined through other means, such as subnavigation, consider whether having a Breadcrumbs component is necessary.

If the site has a flat or very shallow hierarchy, consider whether having a Breadcrumbs component is necessary.

## Guidance

Breadcrumbs should indicate where in the website's information architecture they are, _not how they got to that location_. If the user moves between deep-level pages of different sections of the website, the Breadcrumbs should show which section they are in.

Breadcrumbs should include the page the user is currently on and visually differentiate it appropriately.

On small screens the Breadcrumbs collapse to only show the immediate parent of the current page.

## Accessibility

Use `<nav>` element to indicate that this is a navigational element. Use `aria-label` to differentiate the Breadcrumbs from other navigations, such as those in the header, footer and sidebar. The value of `aria-label` will be read out to screen readers.

The page the user is currently on should be indicated using `aria-current="page"` or `aria-current="true"`.

## Browser considerations

None.
