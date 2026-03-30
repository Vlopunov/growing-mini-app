"""
Growing Community Telegram Bot
Запускает Mini App для бизнес-сообщества Growing.
"""

import os
import logging
from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
    MenuButtonWebApp,
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
)

# --- Config ---
BOT_TOKEN = os.environ.get("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://your-mini-app-url.com")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


# --- Handlers ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send welcome message with Mini App button."""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            text="Открыть Growing App",
            web_app=WebAppInfo(url=WEBAPP_URL),
        )],
        [InlineKeyboardButton(
            text="События",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/events"),
        )],
        [InlineKeyboardButton(
            text="Бизнес-тиндер",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/tinder"),
        )],
    ])

    await update.message.reply_text(
        "Добро пожаловать в Growing! 🌱\n\n"
        "Мы — бизнес-сообщество для предпринимателей "
        "и топ-менеджеров Беларуси.\n\n"
        "Откройте приложение, чтобы:\n"
        "• Узнать о ближайших мероприятиях\n"
        "• Найти полезные контакты через Бизнес-тиндер\n"
        "• Изучить каталог участников\n"
        "• Управлять своим профилем",
        reply_markup=keyboard,
    )


async def events(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open events page."""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            text="Смотреть события",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/events"),
        )],
    ])
    await update.message.reply_text(
        "Конференции и мероприятия Growing:",
        reply_markup=keyboard,
    )


async def tinder(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open business tinder."""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            text="Открыть Бизнес-тиндер",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/tinder"),
        )],
    ])
    await update.message.reply_text(
        "Найдите полезные контакты в бизнес-тиндере:",
        reply_markup=keyboard,
    )


async def catalog(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Open catalog."""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            text="Открыть каталог",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}/catalog"),
        )],
    ])
    await update.message.reply_text(
        "Каталог спикеров и участников сообщества:",
        reply_markup=keyboard,
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show help."""
    await update.message.reply_text(
        "Доступные команды:\n\n"
        "/start — Главное меню\n"
        "/events — Мероприятия\n"
        "/tinder — Бизнес-тиндер\n"
        "/catalog — Каталог участников\n"
        "/help — Помощь"
    )


async def set_menu_button(app) -> None:
    """Set the Menu button to open the Mini App."""
    await app.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Growing App",
            web_app=WebAppInfo(url=WEBAPP_URL),
        )
    )
    logger.info("Menu button set to Mini App")


# --- Main ---

def main() -> None:
    """Start the bot."""
    app = ApplicationBuilder().token(BOT_TOKEN).post_init(set_menu_button).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("events", events))
    app.add_handler(CommandHandler("tinder", tinder))
    app.add_handler(CommandHandler("catalog", catalog))
    app.add_handler(CommandHandler("help", help_command))

    logger.info("Bot started")
    app.run_polling()


if __name__ == "__main__":
    main()
