
export const app = process.env.REACT_APP_TAG
export const title = process.env.REACT_APP_TITLE
const message = (app == "message-app") || (app == "dcrypt-app")
const files = (app == "drop-app") || (app == "dcrypt-app")
export const features = {message: message, files: files}
const config = {app, features, title}
export default config
