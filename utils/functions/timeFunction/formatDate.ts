export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Formatage de la date (ex : "14 Déc 2024")
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-EN', options);  // Utilisation de la locale 'fr-FR' pour afficher en français
};