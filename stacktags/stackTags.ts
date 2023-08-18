import {
    ComponentResourceOptions, 
    getProject, 
    getStack, 
    getOrganization,
    Input, 
    Config
} from "@pulumi/pulumi";
import {StackTag} from "@pulumi/pulumiservice";
import * as schema from "./schema-types";
// import { createHash } from "crypto";

interface Tag {
    Key: string
    Value: string
}

interface TagList {
    Tags: Tag[]
}

export class StackTags extends schema.StackTags {
    constructor(name: string, args: schema.StackTagsArgs, opts: ComponentResourceOptions = {}) {
        super(name, args, opts);

        const configNamespace: string = (args.configNamespace === undefined || args.configNamespace === null) ? getProject() : args.configNamespace.toString();
        const projectName: Input<string> = (args.project === undefined || args.project === null) ? getProject() : args.project;
        const stackName: Input<string> = (args.stack === undefined || args.stack === null) ? getStack() : args.stack. toString();
        const organization: Input<string> = (args.organization === undefined || args.organization === null) ? getOrganization() : args.organization;

        const config = new Config(configNamespace);

        const tags: Tag[] = config.requireObject<TagList>("tags").Tags;
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
            new StackTag(`${organization}-${projectName}-${stackName}-${tags[i].Key}`, {
                organization,
                project: projectName,
                stack: stackName,
                name: tags[i].Key,
                value: tags[i].Value
            })
        }

    }
}