import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import "lib-flexible/flexible";
import "vant/lib/index.css"; // 全局引入样式

import { 
    Button,
    Tabbar, TabbarItem,
    Form, Field,
    Toast ,
    Image as VanImage,
    Cell, CellGroup,
    Dialog ,
    Rate ,
    ActionSheet ,
    FloatingBubble ,
    NumberKeyboard ,
    Progress ,
    Popup 
 } from 'vant'

const app=createApp(App)
app.use(router)
    .use(Button)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Form)
    .use(Field)
    .use(Toast)
    .use(VanImage)
    .use(Cell)
    .use(CellGroup)
    .use(Dialog)
    .use(Rate)
    .use(ActionSheet)
    .use(FloatingBubble)
    .use(NumberKeyboard)
    .use(Progress)
    .use(Popup)

app.mount('#app')
