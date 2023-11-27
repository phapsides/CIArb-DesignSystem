The Switch component provides a means of setting a value on and off through the use of a skeomorphic "switch" device, as popularised in various mobile operating systems.

Under the hood, the Switch component is simply a checkbox with an alternative appearance.

## When to use this component

Where a binary option between "on" and "off" exists. For example, when turning notifications on or off.

## When to consider something else

If the options available cannot be adequately described with the words "on" and "off" then use the Checkboxes or Radios component instead.

If the user should be able to select multiple options from within a group, use the Checkboxes component.

## Guidance

Unlike checkboxes, switches should be individual options akin to a standalone checkbox. Switches should not be grouped together.

Don't use negative language in switch labels, as this is counter-intuitive to their function as an option that can be turned on. For example, a user looking to disable email notifications shouldn't have to turn on "no email notifications".

Users should be able to tap on or click on either the text label or the switch to toggle an option.

Options that are listed vertically are easier to read than those that are listed horizontally. Horizontal listings can make it difficult to tell which label pertains to which switch.

You can add hints to checkbox items to provide additional information about the options.

## Accessibility

Each switch should have a unique `id` attribute.

Each switch should have a text `<label>`. The label should always have a `for` attribute that links the label to the input.

## Browser considerations

None.
