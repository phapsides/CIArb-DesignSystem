Tabs allow for the compact display of related content, where it displays one section of content at a time.

On mobile resolutions, the tabbed layout is removed and the sections rendered as standard flow content, with the tab list acting as a table of contents.

Unlike most components, the Tab is made up of two components—a parent component that acts as the wrapper and navigation for the tabs panels, and a child component that makes up the individual tab panels. Be aware of this when checking the parameter documentation.

## When to use this component

For short, conditional, sectioned content.

## When to consider something else

If the content sections are not related, do not use tabs.

If the content cannot be broken down into meaningful sections, do not use tabs.

If content is intended to be a significant part of the user journey (such as containing a call to action), do not use tabs. Tabs obscure content in a way were the user has to actively search for it.

If the user journey expects the user to read all of the page's content, or read the content in order—for example, when describing a process or giving instructions—do not use tabs.

If the user needs to compare content, do not use tabs. Tabs do not allow the user to view more than one group of content at a time.

Do not put significant amounts of content into tabs. Tabs are for grouped, conditionally appropriate content and not a place to dump things out of sight. If you are finding yourself putting lots of content into tabs, it should probably be split across multiple pages.

Do not use tabs for page navigation.

## Guidance

The first section will always be the one visible by default. Make sure this section contains the content relevant to the most users.

Tabs hide content from users. You should not assume that users will notice or be intuitively aware of how to use tabs.

Limit the number of tab sections being used. Tabs are displayed in a horizontal list, which makes them limited by screen real estate. For the same reason, keep tab labelling succinct.

Changing tabs appends the panel's ID to the current URL. This change to the URL is respected, and the appropriate panel will be shown immediately if the user navigates back to that URL or uses the page's back/forward buttons.

## Accessibility

When a tab is focused (either by keyboard or through interaction), keyboard users can change between tabs using the arrow keys. <kbd>Up</kbd> and <kbd>Left</kbd> will move to the previous tab, <kbd>Down</kbd> and <kbd>Right</kbd> to the next tab.

Each panel requires a unique ID, this is used to associate the tab to the panel, as well as produce generated IDs relevant to the panel.

Various parts of the component have `role`s and `aria-` attributes injected by JavaScript.

## Browser considerations

None.
