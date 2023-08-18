import * as pulumi from "@pulumi/pulumi";
import * as pulumiservice from "@pulumi/pulumiservice";
import * as schema from "./schema-types";
// import { createHash } from "crypto";

interface StackTag {
    Key: string
    Value: string
}

interface StackTagList {
    Tags: StackTag[]
}

export class StackTags extends schema.StackTags {
    constructor(name: string, args: schema.StackTagsArgs, opts: pulumi.ComponentResourceOptions = {}) {
        super(name, args, opts);

        const configNamespace: string = (args.configNamespace === undefined || args.configNamespace === null) ? pulumi.getProject() : args.configNamespace.toString();
        const projectName: pulumi.Input<string> = (args.project === undefined || args.project === null) ? pulumi.getProject() : args.project;
        const stackName: pulumi.Input<string> = (args.stack === undefined || args.stack === null) ? pulumi.getStack() : args.stack. toString();
        const organization: pulumi.Input<string> = (args.organization === undefined || args.organization === null) ? pulumi.getOrganization() : args.organization;

        const config = new pulumi.Config(configNamespace);

        const tags: StackTag[] = config.requireObject<StackTagList>("tags").Tags;
            // .sort((n1, n2) => {
            //     function hash(item: string) {
            //         return createHash('sha256').update(item).digest("hex");
            //     }
            //     const n1Hash: string = hash(n1.Key + n1.Value);
            //     const n2Hash: string = hash(n2.Key + n1.Value);

            //     if (n1Hash < n2Hash) {
            //         return 1;
            //     } else if(n1Hash > n2Hash) {
            //         return -1;
            //     } else {
            //         return 0;
            //     }
            // });

        for(let i = 0; i < tags.length; i++) {
            new pulumiservice.StackTag(`${organization}-${projectName}-${stackName}-${tags[i].Key}`, {
                organization,
                project: projectName,
                stack: stackName,
                name: tags[i].Key,
                value: tags[i].Value
            })
        }

    }
}