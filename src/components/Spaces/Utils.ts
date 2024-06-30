import { FolderDataNode, LeafDataNode, NodeType } from "./Types";

export class Utils {
    static capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static getUniqueIdNumber(): number {
        return Date.now();
    }

    static getUniqueId(): string {
        return Date.now().toString();
    }

    static NewFolder(): FolderDataNode {
        return {
            id: this.getUniqueId(),
            name: "Untitled",
            type: NodeType.Folder,
            children: []
        }
    }

    static Leaf(name: string, url?: string, iconSrc?: string): LeafDataNode {
        return {
            id: this.getUniqueId(),
            name,
            url,
            iconSrc,
            type: NodeType.Leaf,
        }
    }
}