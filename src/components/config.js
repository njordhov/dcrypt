
export const app = process.env.REACT_APP_TAG
export const title = process.env.REACT_APP_TITLE || "dCrypt"
const message = (app === "message-app") || (app === "dcrypt-app")
const files = (app === "drop-app") || (app === "dcrypt-app")
const privacyUrl = process.env.REACT_APP_PRIVACY_URL
const classic = false // (app !== "dcrypt-app")
export const features = {message: message, files: files}
export const icon = '/media/logo.svg'
export const repository = process.env.REPOSITORY_URL || "https://github.com/njordhov/dcrypt"
const config = {app, features, title, icon, privacyUrl, classic}
export default config
