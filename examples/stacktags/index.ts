import * as stacktags from "@pulumi/stacktags";

const page = new stacktags.StaticPage("page", {
    indexContent: "<html><body><p>Hello world!</p></body></html>",
});

export const bucket = page.bucket;
export const url = page.websiteUrl;
