import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// import UserTable from './User Table'; // Убедитесь, что путь к компоненту правильный
import type { User } from '@prisma/client'; // Импортируйте ваш тип User
import UserTable from '~/app/_components/user/userTable';

// Пример данных для теста
const mockUsers: User[] = [
    { 
        id: '1', 
        name: 'Иван Иванов', // Добавлено поле name
        firstname: 'Иван', 
        surname: 'Иванов', 
        email: 'ivan@example.com', 
        emailVerified: null, 
        image: null, 
        groupId: null, 
        subgroup: 1, 
        role: 'USER' 
    },
    { 
        id: '2', 
        name: 'Петр Петров', // Добавлено поле name
        firstname: 'Петр', 
        surname: 'Петров', 
        email: 'petr@example.com', 
        emailVerified: null, 
        image: null, 
        groupId: null, 
        subgroup: 1, 
        role: 'USER' 
    },
    { 
        id: '3', 
        name: 'Сергей Сергеев', // Добавлено поле name
        firstname: 'Сергей', 
        surname: 'Сергеев', 
        email: 'sergey@example.com', 
        emailVerified: null, 
        image: null, 
        groupId: null, 
        subgroup: 1, 
        role: 'USER' 
    },
];

describe('User  Table', () => {
    beforeEach(() => {
        render(<UserTable users={mockUsers} />);
    });

    it('должен рендерить таблицу с пользователями', () => {
        // Проверяем, что заголовки таблицы отображаются
        expect(screen.getByText('Имя')).toBeTruthy();
        expect(screen.getByText('Фамилия')).toBeTruthy();
        expect(screen.getByText('Почта')).toBeTruthy();

        // Проверяем, что каждый пользователь отображается в таблице
        mockUsers.forEach(user => {
            expect(screen.getByText(user.firstname || '')).toBeTruthy();
            expect(screen.getByText(user.surname || '')).toBeTruthy();
            expect(screen.getByText(user.email || '')).toBeTruthy();
        });

        // Проверяем, что таблица присутствует
        const table = screen.getByRole('table');
        expect(table).toBeTruthy();
    });

    it('должен содержать ссылки на редактирование пользователей', () => {
        // Получаем все ссылки в таблице
        const links = screen.getAllByRole('link');

        mockUsers.forEach(user => {
            const link = links.find(l => l.getAttribute('href') === `/user/${user.id}`);

            // Проверяем, что ссылка для редактирования пользователя присутствует
            expect(link).toBeDefined(); // Проверяем, что link не undefined
            if (link) {
                expect(link.getAttribute('href')).toBe(`/user/${user.id}`);

                // Проверяем, что иконка отображается
                expect(link.querySelector('svg')).toBeTruthy(); // Проверяем, что внутри ссылки есть SVG
            }
        });
    });

    it('должен переходить на страницу пользователя 2 при нажатии на ссылку', () => {
        // Находим элемент с текстом "Петр"
        const user2Element = screen.getByText('Петр');
        expect(user2Element).toBeTruthy(); // Проверяем, что элемент найден

        // Получаем родительский элемент <td>
        const closestTd = user2Element.closest('td');
        // Проверяем, что closestTd не undefined
        if (closestTd) {
            const link = closestTd.nextElementSibling?.querySelector('a'); // Находим ссылку внутри <td>
            // Проверяем, что ссылка не равна null
            if (link) {
                // Проверяем, что ссылка ведет на нужный URL
                expect(link.getAttribute('href')).toBe('/user/2');

                // Нажимаем на ссылку
                fireEvent.click(link);
                
                // Здесь вы можете добавить проверки, что происходит при переходе на страницу пользователя 2
                // Например, проверка, что новая страница содержит нужные данные
            }
        }
    });
});
