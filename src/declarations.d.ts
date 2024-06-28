declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}
declare module '*module.scss';

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}