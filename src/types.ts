export interface Client {
    id: number;
    name: string;
    login: string;
    image: string | null;
    phone: string | null;
    address: string | null;
    client_roles_id: number;
    age: number;
    score: number | null;
    email: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        contest_id: number;
        client_id: number;
    };
}

export interface Contest {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    announce_results_date: string;
    short_description: string;
    description: string;
    prizes: string[];
    status: string;
    source: string;
    clients: Client[];
}

export interface News {
    id: number;
    caption: string;
    title: string;
    short_description: string;
    full_content: string;
    date: string;
    images: string[];
    likes_count: number;
    comments: string[]
}

export interface Clubs {
    name: string;
    caption: string;
    short_description: string;
    age: number;
    description: string;
    source: string[];
    clients_count: number;
    clients: any[];
    events: any[];
}
