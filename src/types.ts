import exp from "constants";

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
    announce_results_date: string;
    description: string;
    end_date: string;
    id: number;
    name: string;
    participants: any[];
    prizes: string[];
    short_description: string;
    source: string;
    start_date: string;
    status: string;
}

export interface Participant {
    id: number;

}

export interface ContestPivot {
    contest_id: number;
    client_id: number;
}

export interface ContestUser {
    id: number;
    name: string;
    start_date: string;
    announce_results_date: string;
    short_description: string;
    description: string;
    prizes: any[];
    source: string;
    created_at: string;
    updated_at: string;
    pivot: ContestPivot;
}

export interface News {
    id: number;
    sectionName: string;
    title: string;
    imagePreviewResized: string;
    createdAt: string;
    publishDate: string;
    tags: string;
    url: string;
}

export interface NewsBack {
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

export interface TrainingVideo {
    id: number;
    name: string;
    source: string;
    description: string;
    created_at: string;
    updated_at: string
}

export interface TrainingImage {
    id: number;
    name: string;
    type: number;
    source: string;
    description: string;
    created_at: string;
    updated_at: string
}

export interface Sport {
    training_videos: TrainingVideo[];
    healthy_eating_video: TrainingVideo[];
    healthy_eating_img: TrainingImage[];
}

export interface Student {
    id: number,
    title: string;
    imagePreviewResized: string;
}

export interface Coach {
    id: number,
    title: string;
    imagePreviewResized: string;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    source: string[];
    clients_id: number;
    created_at: string;
    updated_at: string;
    likes_count: number;
}

export interface PhotoGallery {
    id: number;
    sectionName: string;
    title: string;
    imagePreviewResized: string;
    createdAt: "string";
    publishDate: "string";
    tags: "string";
    photos: String[];
}