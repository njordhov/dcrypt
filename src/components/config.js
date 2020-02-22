
const app = process.env.REACT_APP_TAG
const message = (app == "message-app") || (app == "dcrypt-app")
const files = (app == "drop-app") || (app == "dcrypt-app")
export const features = {message: message, files: files}
