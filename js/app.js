// ВРЕМОНТЕ | Основное приложение с Telegram интеграцией
class VremonteApp {
    constructor() {
        this.user = null;
        this.isDemo = false;
        this.init();
    }
    
    init() {
        console.log('🚀 Времонте запускается...');
        
        // Проверяем режим (демо или реальный)
        const urlParams = new URLSearchParams(window.location.search);
        this.isDemo = urlParams.get('demo') === 'true';
        
        // Проверяем авторизацию
        this.checkAuth();
        
        // Инициализируем Telegram Web App если доступно
        this.initTelegram();
        
        // Показываем интерфейс
        this.render();
    }
    
    checkAuth() {
        // Проверяем сохранённую сессию
        const savedUser = localStorage.getItem('vremonte_user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
        }
    }
    
    initTelegram() {
        // Инициализация Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Настраиваем Telegram Web App
            tg.expand();
            tg.enableClosingConfirmation();
            tg.setHeaderColor('#1a2980');
            tg.setBackgroundColor('#1a2980');
            
            // Получаем данные пользователя
            const user = tg.initDataUnsafe.user;
            if (user) {
                this.user = {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    username: user.username,
                    photoUrl: user.photo_url,
                    isTelegram: true
                };
                
                localStorage.setItem('vremonte_user', JSON.stringify(this.user));
                console.log('✅ Пользователь Telegram авторизован:', this.user);
            }
            
            // Показываем кнопку "Закрыть" в Telegram Web App
            if (tg.platform !== 'unknown') {
                tg.BackButton.show();
                tg.BackButton.onClick(() => {
                    tg.close();
                });
            }
        }
    }
    
    render() {
        const app = document.getElementById('app') || document.body;
        
        if (!this.user && !this.isDemo) {
            // Показываем экран авторизации
            app.innerHTML = this.getAuthScreen();
        } else {
            // Показываем главный экран
            app.innerHTML = this.getMainScreen();
        }
    }
    
    getAuthScreen() {
        return `
            <div class="container">
                <div class="logo">🏔️</div>
                <h1>ВРЕМОНТЕ</h1>
                <p>Безопасные услуги в Якутии</p>
                
                <button class="btn btn-primary" onclick="app.loginWithTelegram()">
                    <span style="font-size: 1.4em">📱</span><br>
                    ВОЙТИ ЧЕРЕЗ TELEGRAM
                </button>
                
                <div class="divider">или</div>
                
                <button class="btn btn-secondary" onclick="app.startDemo()">
                    <span style="font-size: 1.4em">🎮</span><br>
                    ДЕМО-РЕЖИМ
                    <small>(для тестирования)</small>
                </button>
                
                <div class="features">
                    <p>✅ Все мастера проверены по паспорту</p>
                    <p>📍 Только ваш район (10 км радиус)</p>
                    <p>📞 Контакт виден только после выбора</p>
                    <p>⭐ Бесплатно для всех</p>
                </div>
            </div>
        `;
    }
    
    getMainScreen() {
        const userName = this.user ? 
            (this.user.firstName || this.user.username || 'Пользователь') : 
            'Демо-пользователь';
        
        return `
            <div class="container">
                <div class="user-header">
                    <div class="avatar">${userName.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <h2>${userName}</h2>
                        <p>${this.isDemo ? '👑 Демо-режим' : '✅ Авторизован'}</p>
                    </div>
                </div>
                
                <div class="main-actions">
                    <h3>Что вам нужно?</h3>
                    
                    <button class="btn btn-primary" onclick="app.showClientMode()">
                        <span style="font-size: 1.4em">🎯</span><br>
                        СОЗДАТЬ ЗАКАЗ
                        <small>Нужен проверенный мастер</small>
                    </button>
                    
                    <div class="divider">или</div>
                    
                    <button class="btn btn-secondary" onclick="app.showMasterMode()">
                        <span style="font-size: 1.4em">👷</span><br>
                        СТАТЬ МАСТЕРОМ
                        <small>Ищу работу в радиусе 10 км</small>
                    </button>
                </div>
                
                <div class="stats">
                    <h4>📊 Статистика платформы</h4>
                    <p>✅ 1,245 проверенных пользователей</p>
                    <p>📍 Работает в Якутске, Нюрбе, Мирном</p>
                    <p>⭐ 0 случаев мошенничества</p>
                </div>
                
                <button class="btn btn-outline" onclick="app.logout()">
                    🔄 Сменить аккаунт
                </button>
            </div>
        `;
    }
    
    loginWithTelegram() {
        // Ссылка для открытия в Telegram Web App
        const botUsername = 'vremonte_yakutia_bot';
        const webAppUrl = encodeURIComponent('https://vremonte26.github.io/vremonte-yakutia/');
        
        // Открываем в Telegram если приложение из Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink(`https://t.me/${botUsername}/vremonte`);
        } else {
            // Открываем в браузере ссылку на бота
            window.open(`https://t.me/${botUsername}?start=webapp`, '_blank');
            
            alert(`📱 Откройте эту ссылку в Telegram:\n\nhttps://t.me/${botUsername}\n\nЗатем нажмите кнопку "Start" или "Запустить"`);
        }
    }
    
    startDemo() {
        this.isDemo = true;
        this.user = {
            id: 'demo_001',
            firstName: 'Демо',
            lastName: 'Пользователь',
            username: 'demo_user'
        };
        
        localStorage.setItem('vremonte_user', JSON.stringify(this.user));
        localStorage.setItem('vremonte_demo', 'true');
        
        this.render();
        
        alert('🎮 ДЕМО-РЕЖИМ АКТИВИРОВАН\n\nТеперь вы можете тестировать:\n• Создание заказов\n• Ленту заказов\n• Систему откликов\n• Интерфейс клиента/мастера\n\n📝 Все данные сохраняются локально');
    }
    
    showClientMode() {
        alert('🎯 РЕЖИМ КЛИЕНТА\n\nЗдесь будет:\n• Создание заказа с фото\n• Указание адреса\n• Выбор из 5 ближайших мастеров\n• Чат с выбранным мастером\n\n⏳ Раздел в разработке');
    }
    
    showMasterMode() {
        alert('👷 РЕЖИМ МАСТЕРА\n\nЗдесь будет:\n• Лента заказов в радиусе 10 км\n• Карта с булавками заказов\n• Система откликов (макс 5)\n• Ваша статистика и рейтинг\n\n⏳ Раздел в разработке');
    }
    
    logout() {
        localStorage.removeItem('vremonte_user');
        localStorage.removeItem('vremonte_demo');
        this.user = null;
        this.isDemo = false;
        this.render();
    }
}

// Инициализация приложения
const app = new VremonteApp();
window.app = app; // Делаем глобально доступным
