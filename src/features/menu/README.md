# Menu Feature

Полнофункциональная система управления меню для админ-панели.

## Структура

```
features/menu/
├── api/
│   └── index.ts           # API вызовы
├── model/
│   ├── actions.ts         # Redux actions
│   ├── reducer.ts         # Redux reducer
│   ├── saga.ts           # Redux-Saga effects
│   ├── selectors.ts      # Redux selectors
│   └── types.ts          # TypeScript типы
├── ui/
│   ├── MenuManagePage.tsx # Главная страница управления
│   ├── MenuTypeForm.tsx   # Форма типов меню
│   ├── MenuItemForm.tsx   # Форма пунктов меню
│   ├── MenuTree.tsx      # Дерево с drag & drop
│   └── MenuSider.tsx     # Навигационное меню
├── lib/
│   └── utils.ts          # Утилиты для работы с деревом
├── validation/
│   └── schemas.ts        # Zod схемы валидации
└── index.ts              # Экспорты

```

## Функциональность

### Типы меню

- Создание типов меню
- Редактирование типов меню
- Удаление типов меню
- Список типов меню

### Пункты меню

- Создание пунктов меню
- Редактирование пунктов меню
- Удаление пунктов меню
- Drag & Drop сортировка
- Иерархическая структура
- Сохранение структуры

### UI компоненты

- Административная панель управления
- Навигационное меню (Sider)
- Формы с валидацией
- Drag & Drop интерфейс

## API Endpoints

### Menu Types

- `GET /manage/menu/types` - получить типы меню
- `POST /manage/menu/types/add` - добавить тип меню
- `POST /manage/menu/types/edit` - редактировать тип меню
- `DELETE /manage/menu/types/remove` - удалить тип меню

### Menu Items

- `GET /manage/menu/items/tree` - получить дерево для навигации
- `GET /manage/menu/items/tree-list` - получить плоский список для управления
- `POST /manage/menu/items/add` - добавить пункт меню
- `POST /manage/menu/items/edit` - редактировать пункт меню
- `DELETE /manage/menu/items/remove` - удалить пункт меню
- `POST /manage/menu/items/save-structure` - сохранить структуру

## Использование

### Управление меню

```typescript
import { MenuManagePage } from "features/menu";

// В роутинге
<Route path="/menu" element={<MenuManagePage />} />
```

### Навигационное меню

```typescript
import { MenuSider } from "features/menu";

// В компоненте
<MenuSider
  typeId="main-menu"
  onMenuClick={(key, item) => {
    // Обработка клика по пункту меню
    if (item.route) {
      navigate(item.route);
    } else if (item.customUrl) {
      window.open(item.customUrl, '_blank');
    }
  }}
/>
```

## Особенности реализации

### Drag & Drop

- Перетаскивание работает только в админке
- Изменения сохраняются локально до нажатия "Сохранить"
- Поддерживается вложенность и изменение порядка

### Состояние

- `dirty` флаг показывает наличие несохраненных изменений
- Автоматическое обновление после операций CRUD
- Раздельное управление tree (навигация) и tree-list (админка)

### Валидация

- Zod схемы для форм
- Проверка URL для внешних ссылок
- Обязательные поля с сообщениями об ошибках

## Тестирование

Покрыто тестами:

- Валидация форм
- Утилиты работы с деревом
- Преобразование данных

```bash
npm test menu
```
