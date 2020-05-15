//index.js
const app = getApp()

Component({
    properties: {
        text: {
            type: String,
            value: '确认'
        },
        marginTop: {
            type: Number,
            value: 40
        },
        marginButtom: {
            type: Number,
            value: 40
        },
        background: {
            type: String,
            value: '#C7143D'
        },
        position: {
            type: String,
            value: 'relative'
        }
    },

    methods: {
        tap() {
            this.triggerEvent('clickBtn');
        }
    }
})
