export interface CalculResponse {
    distance: number;
    model: string;
    vitesse: number;
    temps: {
        heures: number;
        minutes: number;
        secondes: number;
        decimal: number;
    };
    message: string;
}