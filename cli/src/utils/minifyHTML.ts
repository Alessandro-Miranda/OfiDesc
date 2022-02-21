export default function minifyHTML(html: string) {
    return html.replace(/\s{2,}/g, '');
}
