```

export default {
    config: {state: string, default state: 'on', 'off', custom}
    scriptLoaded: function
    documentLoaded: function, on document load
    commentsReloaded: function, on comments reloaded
    button: {
        text: string
        states: {
            on: function, fires when setting is triggered on
            off: function, fires when setting is triggered off
            custom
        }
    }
}

```
