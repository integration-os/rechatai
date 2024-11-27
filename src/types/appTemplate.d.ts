export interface AppTemplate {
    _id: string;
    category: string;
    code: string;
    description?: string;
    image: string;
    platformsUsed?: {
        connectionKey: string;
        models: string[];
        platform: string;
    }[]
    prompt: string;
    name: string;
    title: string;
}