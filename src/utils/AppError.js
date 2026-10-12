export class AppError extends Error { // Errorun bütün özelliklerine sahip üstüne ek özellikleri var.
    constructor(message, statusCode) { // new AppError() yazıldığında çalışacak fonksiyon
        // nesnenin başlangıç değerlerini ayarlar
        super(message); // Errorun constructerini çağırır. message alanını kurar. 
        // extends kullanıldığında thise dokunmadan
        //önce super çağırmak zorunludur.
        this.statusCode = statusCode; // nesneye statusCode ekler
        this.isOperational = true;  // bu hata bilerek fırlatıldı işareti beklenen öngörülen hata
    }
}