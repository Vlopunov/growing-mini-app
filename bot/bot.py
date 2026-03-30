"""
Growing Community Telegram Bot
Full-featured bot for Growing business community Mini App.
"""

import os
import json
import logging
from datetime import datetime
from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
    MenuButtonWebApp,
    BotCommand,
    BotCommandScopeDefault,
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineQueryResultArticle,
    InputTextMessageContent,
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    InlineQueryHandler,
    ContextTypes,
    filters,
)
from telegram.constants import ParseMode

# --- Config ---
BOT_TOKEN = os.environ.get("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://growing-mini-app-production.up.railway.app")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# --- Event Data (mirrors mini-app mock) ---
EVENTS = [
    {
        "id": "1",
        "title": "Growing. Focus",
        "subtitle": "Стратегии масштабирования бизнеса в 2026",
        "date": "20 апреля 2026",
        "time": "10:00 - 18:00",
        "location": "Minsk City Mall",
        "address": "пр-т Победителей, 9, Минск",
        "price": "290 BYN",
        "speaker": "Анастасия Белочкина",
        "attendees": 186,
        "max": 250,
        "status": "upcoming",
    },
    {
        "id": "2",
        "title": "Growing. Trends 2026",
        "subtitle": "Главные бизнес-тренды нового сезона",
        "date": "15 мая 2026",
        "time": "10:00 - 20:00",
        "location": "Falcon Club",
        "address": "ул. Интернациональная, 21, Минск",
        "price": "390 BYN",
        "speaker": "Дмитрий Козлов, Мария Соколова, Алексей Петров",
        "attendees": 312,
        "max": 400,
        "status": "upcoming",
    },
    {
        "id": "3",
        "title": "Growing. Business Environment",
        "subtitle": "Создание среды для роста бизнеса",
        "date": "10 марта 2026",
        "time": "10:00 - 17:00",
        "location": "DoubleTree by Hilton",
        "address": "пр-т Победителей, 9, Минск",
        "price": "250 BYN",
        "speaker": "Елена Власова",
        "attendees": 120,
        "max": 120,
        "status": "past",
    },
]

COMMUNITY_STATS = {
    "members": "1 464",
    "events": "52",
    "speakers": "200+",
    "connections": "3 500+",
}


# --- Helpers ---

def event_text(event: dict, detailed: bool = False) -> str:
    """Format event as a rich message."""
    status_emoji = "🟢" if event["status"] == "upcoming" else "⚪️"
    spots_left = event["max"] - event["attendees"]
    progress = round(event["attendees"] / event["max"] * 100)
    bar = "█" * (progress // 10) + "░" * (10 - progress // 10)

    text = (
        f"{status_emoji} *{event['title']}*\n"
        f"_{event['subtitle']}_\n\n"
        f"📅 {event['date']}\n"
        f"🕐 {event['time']}\n"
        f"📍 {event['location']}\n"
    )

    if detailed:
        text += (
            f"🏠 {event['address']}\n\n"
            f"🎤 *Спикеры:* {event['speaker']}\n\n"
            f"👥 Участники: {event['attendees']}/{event['max']}\n"
            f"     {bar}  {progress}%\n"
        )
        if event["status"] == "upcoming":
            text += f"\n🔥 Осталось мест: *{spots_left}*\n"

    text += f"\n💰 Стоимость: *{event['price']}*"
    return text


def event_keyboard(event: dict, show_back: bool = False) -> InlineKeyboardMarkup:
    """Build keyboard for an event."""
    buttons = []

    if event["status"] == "upcoming":
        buttons.append([InlineKeyboardButton(
            "✅ Зарегистрироваться",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/events/{event['id']}"),
        )])

    buttons.append([InlineKeyboardButton(
        "📱 Открыть в приложении",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}/events/{event['id']}"),
    )])

    if show_back:
        buttons.append([InlineKeyboardButton("◀️ Назад к списку", callback_data="events_list")])

    return InlineKeyboardMarkup(buttons)


# --- Command Handlers ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Welcome message with main menu."""
    user = update.effective_user
    name = user.first_name or "друг"

    # Reply keyboard with persistent buttons
    reply_kb = ReplyKeyboardMarkup(
        [
            [KeyboardButton("📱 Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
            [KeyboardButton("📅 События"), KeyboardButton("💼 Бизнес-тиндер")],
            [KeyboardButton("📖 Каталог"), KeyboardButton("👤 Мой профиль")],
        ],
        resize_keyboard=True,
        is_persistent=True,
    )

    # Inline keyboard
    inline_kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Открыть Growing App", web_app=WebAppInfo(url=WEBAPP_URL))],
        [
            InlineKeyboardButton("📅 События", callback_data="events_list"),
            InlineKeyboardButton("💼 Тиндер", web_app=WebAppInfo(url=f"{WEBAPP_URL}/tinder")),
        ],
        [
            InlineKeyboardButton("📖 Каталог", web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog")),
            InlineKeyboardButton("📊 Статистика", callback_data="stats"),
        ],
        [InlineKeyboardButton("ℹ️ О сообществе", callback_data="about")],
    ])

    await update.message.reply_text(
        f"Привет, *{name}*! 👋\n\n"
        f"Добро пожаловать в *Growing* — бизнес-сообщество "
        f"для предпринимателей и топ-менеджеров Беларуси.\n\n"
        f"🌱 *{COMMUNITY_STATS['members']}* участников\n"
        f"🎤 *{COMMUNITY_STATS['speakers']}* спикеров\n"
        f"📅 *{COMMUNITY_STATS['events']}* мероприятий проведено\n\n"
        f"Выберите действие:",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=reply_kb,
    )

    await update.message.reply_text(
        "⬇️ *Быстрые действия:*",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=inline_kb,
    )


async def events_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show events list."""
    await send_events_list(update.message, context)


async def send_events_list(target, context, edit: bool = False) -> None:
    """Send or edit events list message."""
    upcoming = [e for e in EVENTS if e["status"] == "upcoming"]
    past = [e for e in EVENTS if e["status"] == "past"]

    text = "📅 *Мероприятия Growing*\n\n"

    if upcoming:
        text += "🟢 *Предстоящие:*\n\n"
        for e in upcoming:
            spots = e["max"] - e["attendees"]
            text += f"• *{e['title']}*\n  {e['date']} | {e['location']} | {e['price']}\n  👥 Осталось мест: {spots}\n\n"

    if past:
        text += "⚪️ *Прошедшие:*\n\n"
        for e in past:
            text += f"• *{e['title']}*\n  {e['date']} | {e['location']}\n\n"

    buttons = []
    for e in upcoming:
        buttons.append([InlineKeyboardButton(
            f"📌 {e['title']} — {e['date']}",
            callback_data=f"event_{e['id']}",
        )])

    buttons.append([InlineKeyboardButton(
        "📱 Все события в приложении",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}/events"),
    )])
    buttons.append([InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")])

    kb = InlineKeyboardMarkup(buttons)

    if edit and hasattr(target, 'edit_text'):
        await target.edit_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)
    else:
        await target.reply_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)


async def tinder_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open business tinder."""
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("💼 Открыть Бизнес-тиндер", web_app=WebAppInfo(url=f"{WEBAPP_URL}/tinder"))],
        [InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")],
    ])

    await update.message.reply_text(
        "💼 *Бизнес-тиндер*\n\n"
        "Находите полезные деловые контакты!\n\n"
        "🔄 Свайпайте карточки участников\n"
        "💚 Вправо — хочу познакомиться\n"
        "❌ Влево — пропустить\n"
        "🤝 Совпадение = новый контакт!\n\n"
        "Нажмите кнопку, чтобы начать:",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=kb,
    )


async def catalog_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open catalog."""
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("🎤 Спикеры", web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog"))],
        [InlineKeyboardButton("👥 Участники", web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog"))],
        [InlineKeyboardButton("📱 Весь каталог", web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog"))],
        [InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")],
    ])

    await update.message.reply_text(
        "📖 *Каталог сообщества*\n\n"
        "Спикеры, участники и компании Growing.\n"
        "Поиск по имени, компании или навыкам.\n\n"
        f"👥 *{COMMUNITY_STATS['members']}* участников\n"
        f"🎤 *{COMMUNITY_STATS['speakers']}* спикеров\n\n"
        "Выберите категорию:",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=kb,
    )


async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open profile."""
    user = update.effective_user
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("👤 Открыть профиль", web_app=WebAppInfo(url=f"{WEBAPP_URL}/profile"))],
        [InlineKeyboardButton("✏️ Редактировать визитку", web_app=WebAppInfo(url=f"{WEBAPP_URL}/profile"))],
        [InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")],
    ])

    await update.message.reply_text(
        f"👤 *Ваш профиль*\n\n"
        f"Имя: *{user.full_name}*\n"
        f"Username: @{user.username or '—'}\n"
        f"ID: `{user.id}`\n\n"
        f"В приложении вы можете:\n"
        f"• Заполнить бизнес-визитку\n"
        f"• Указать компанию и должность\n"
        f"• Добавить интересы и ссылки\n"
        f"• Управлять контактами и событиями",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=kb,
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show help."""
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton("💬 Написать в поддержку", url="https://t.me/growing_by")],
    ])

    await update.message.reply_text(
        "ℹ️ *Помощь — Growing Bot*\n\n"
        "*Команды:*\n"
        "/start — Главное меню\n"
        "/events — Мероприятия\n"
        "/tinder — Бизнес-тиндер\n"
        "/catalog — Каталог участников\n"
        "/profile — Мой профиль\n"
        "/next — Ближайшее событие\n"
        "/stats — Статистика сообщества\n"
        "/help — Эта справка\n\n"
        "*Как пользоваться:*\n"
        "1. Нажмите «Открыть приложение» или кнопку Menu\n"
        "2. Перемещайтесь между разделами через табы внизу\n"
        "3. Используйте команды бота для быстрого доступа\n\n"
        "*Ссылки:*\n"
        "🌐 growing.by\n"
        "📸 @growing\\_by",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=kb,
    )


async def next_event(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show next upcoming event with full details."""
    upcoming = [e for e in EVENTS if e["status"] == "upcoming"]
    if not upcoming:
        await update.message.reply_text("Сейчас нет предстоящих мероприятий. Следите за анонсами!")
        return

    event = upcoming[0]
    text = event_text(event, detailed=True)
    kb = event_keyboard(event)
    await update.message.reply_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)


async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show community statistics."""
    await send_stats(update.message)


async def send_stats(target, edit: bool = False) -> None:
    """Send stats message."""
    text = (
        "📊 *Growing в цифрах*\n\n"
        f"👥 Участников: *{COMMUNITY_STATS['members']}*\n"
        f"📅 Мероприятий: *{COMMUNITY_STATS['events']}*\n"
        f"🎤 Спикеров: *{COMMUNITY_STATS['speakers']}*\n"
        f"🤝 Контактов: *{COMMUNITY_STATS['connections']}*\n\n"
        "🌱 Сообщество растёт каждый день!"
    )

    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")],
    ])

    if edit and hasattr(target, 'edit_text'):
        await target.edit_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)
    else:
        await target.reply_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)


# --- Callback Query Handler ---

async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle all inline button callbacks."""
    query = update.callback_query
    await query.answer()
    data = query.data

    if data == "main_menu":
        kb = InlineKeyboardMarkup([
            [InlineKeyboardButton("🚀 Открыть Growing App", web_app=WebAppInfo(url=WEBAPP_URL))],
            [
                InlineKeyboardButton("📅 События", callback_data="events_list"),
                InlineKeyboardButton("💼 Тиндер", web_app=WebAppInfo(url=f"{WEBAPP_URL}/tinder")),
            ],
            [
                InlineKeyboardButton("📖 Каталог", web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog")),
                InlineKeyboardButton("📊 Статистика", callback_data="stats"),
            ],
            [InlineKeyboardButton("ℹ️ О сообществе", callback_data="about")],
        ])
        await query.message.edit_text(
            "⬇️ *Быстрые действия:*",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=kb,
        )

    elif data == "events_list":
        await send_events_list(query.message, context, edit=True)

    elif data.startswith("event_"):
        event_id = data.replace("event_", "")
        event = next((e for e in EVENTS if e["id"] == event_id), None)
        if event:
            text = event_text(event, detailed=True)
            kb = event_keyboard(event, show_back=True)
            await query.message.edit_text(text, parse_mode=ParseMode.MARKDOWN, reply_markup=kb)

    elif data == "stats":
        await send_stats(query.message, edit=True)

    elif data == "about":
        kb = InlineKeyboardMarkup([
            [InlineKeyboardButton("🌐 Сайт growing.by", url="https://growing.by")],
            [InlineKeyboardButton("📸 Instagram", url="https://instagram.com/growing_by")],
            [InlineKeyboardButton("💬 Telegram-группа", url="https://t.me/growing_by")],
            [InlineKeyboardButton("◀️ Главное меню", callback_data="main_menu")],
        ])
        await query.message.edit_text(
            "🌱 *О Growing*\n\n"
            "Growing — крупнейшее бизнес-сообщество Беларуси "
            "для предпринимателей и топ-менеджеров.\n\n"
            "*Что мы делаем:*\n"
            "• Организуем конференции и бизнес-мероприятия\n"
            "• Создаём пространство для нетворкинга\n"
            "• Приглашаем топовых спикеров\n"
            "• Помогаем находить деловые контакты\n\n"
            "*Формат:*\n"
            "Максимальная концентрация — один топ-спикер, "
            "одна острая тема и готовые решения для внедрения.\n\n"
            f"👥 {COMMUNITY_STATS['members']} участников\n"
            f"📅 {COMMUNITY_STATS['events']} мероприятий",
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=kb,
        )

    elif data == "register_event":
        await query.answer("Откройте приложение для регистрации!", show_alert=True)


# --- Text Message Handler (for reply keyboard) ---

async def text_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle text messages from reply keyboard."""
    text = update.message.text

    if "События" in text or "событи" in text.lower():
        await events_command(update, context)
    elif "Бизнес-тиндер" in text or "тиндер" in text.lower() or "нетворкинг" in text.lower():
        await tinder_command(update, context)
    elif "Каталог" in text or "каталог" in text.lower():
        await catalog_command(update, context)
    elif "Профиль" in text or "профиль" in text.lower():
        await profile_command(update, context)
    elif "статистик" in text.lower() or "цифр" in text.lower():
        await stats_command(update, context)
    else:
        # Default: suggest opening the app
        kb = InlineKeyboardMarkup([
            [InlineKeyboardButton("🚀 Открыть Growing App", web_app=WebAppInfo(url=WEBAPP_URL))],
        ])
        await update.message.reply_text(
            "Используйте команды или кнопки меню для навигации.\n"
            "Или откройте приложение:",
            reply_markup=kb,
        )


# --- Web App Data Handler ---

async def webapp_data_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle data sent from Mini App via Telegram.WebApp.sendData()."""
    try:
        data = json.loads(update.effective_message.web_app_data.data)
        action = data.get("action", "")

        if action == "register_event":
            event_id = data.get("event_id")
            event = next((e for e in EVENTS if e["id"] == event_id), None)
            if event:
                await update.message.reply_text(
                    f"✅ *Вы зарегистрировались!*\n\n"
                    f"📌 {event['title']}\n"
                    f"📅 {event['date']}\n"
                    f"📍 {event['location']}\n\n"
                    f"Мы пришлём напоминание за день до события.",
                    parse_mode=ParseMode.MARKDOWN,
                )
            else:
                await update.message.reply_text("✅ Регистрация подтверждена!")

        elif action == "new_match":
            person_name = data.get("person_name", "участник")
            await update.message.reply_text(
                f"🤝 *Новый контакт!*\n\n"
                f"Вы и *{person_name}* хотите познакомиться.\n"
                f"Откройте приложение, чтобы начать общение!",
                parse_mode=ParseMode.MARKDOWN,
            )

        elif action == "profile_update":
            await update.message.reply_text(
                "✅ Ваш профиль обновлён!",
                parse_mode=ParseMode.MARKDOWN,
            )

        else:
            logger.info(f"WebApp data received: {data}")
            await update.message.reply_text("✅ Данные получены!")

    except (json.JSONDecodeError, AttributeError) as e:
        logger.error(f"Error processing webapp data: {e}")
        await update.message.reply_text("✅ Принято!")


# --- Inline Query Handler ---

async def inline_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle inline queries — share events in any chat."""
    query = update.inline_query.query.lower()

    results = []
    for event in EVENTS:
        if query and query not in event["title"].lower() and query not in event["subtitle"].lower():
            continue

        status = "🟢 Предстоящее" if event["status"] == "upcoming" else "⚪️ Прошедшее"
        spots = event["max"] - event["attendees"]

        text = (
            f"🌱 *{event['title']}*\n"
            f"_{event['subtitle']}_\n\n"
            f"📅 {event['date']} | 🕐 {event['time']}\n"
            f"📍 {event['location']}, {event['address']}\n"
            f"💰 {event['price']}\n"
            f"👥 {event['attendees']}/{event['max']} ({status})\n"
        )
        if event["status"] == "upcoming":
            text += f"\n🔥 Осталось мест: {spots}"

        text += f"\n\n🚀 Подробнее: @growingby\\_bot"

        kb = InlineKeyboardMarkup([
            [InlineKeyboardButton(
                "📱 Подробнее в приложении",
                url=f"https://t.me/growingby_bot?startapp=event_{event['id']}",
            )],
        ])

        results.append(InlineQueryResultArticle(
            id=event["id"],
            title=f"{event['title']} — {event['date']}",
            description=f"{event['subtitle']} | {event['price']} | {event['location']}",
            input_message_content=InputTextMessageContent(
                message_text=text,
                parse_mode=ParseMode.MARKDOWN,
            ),
            reply_markup=kb,
        ))

    await update.inline_query.answer(results, cache_time=60)


# --- Bot Setup ---

async def post_init(app) -> None:
    """Set commands, menu button, and description on startup."""
    # Set menu button
    await app.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Growing App",
            web_app=WebAppInfo(url=WEBAPP_URL),
        )
    )
    logger.info("Menu button set")

    # Set bot commands
    commands = [
        BotCommand("start", "Главное меню"),
        BotCommand("events", "Мероприятия"),
        BotCommand("next", "Ближайшее событие"),
        BotCommand("tinder", "Бизнес-тиндер"),
        BotCommand("catalog", "Каталог участников"),
        BotCommand("profile", "Мой профиль"),
        BotCommand("stats", "Статистика сообщества"),
        BotCommand("help", "Помощь"),
    ]
    await app.bot.set_my_commands(commands, scope=BotCommandScopeDefault())
    logger.info("Bot commands set")

    # Set bot description
    await app.bot.set_my_description(
        "🌱 Growing — бизнес-сообщество для предпринимателей и "
        "топ-менеджеров Беларуси. Конференции, нетворкинг, "
        "полезные контакты."
    )

    await app.bot.set_my_short_description(
        "Бизнес-сообщество Growing. Конференции, нетворкинг, контакты."
    )
    logger.info("Bot descriptions set")


# --- Main ---

def main() -> None:
    """Start the bot."""
    app = ApplicationBuilder().token(BOT_TOKEN).post_init(post_init).build()

    # Commands
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("events", events_command))
    app.add_handler(CommandHandler("next", next_event))
    app.add_handler(CommandHandler("tinder", tinder_command))
    app.add_handler(CommandHandler("catalog", catalog_command))
    app.add_handler(CommandHandler("profile", profile_command))
    app.add_handler(CommandHandler("stats", stats_command))
    app.add_handler(CommandHandler("help", help_command))

    # Callbacks (inline buttons)
    app.add_handler(CallbackQueryHandler(callback_handler))

    # Web App data
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, webapp_data_handler))

    # Inline queries (share events in chats)
    app.add_handler(InlineQueryHandler(inline_handler))

    # Text messages (reply keyboard)
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_handler))

    logger.info("Growing Bot started — all handlers registered")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
