<template>
  <section class="py-3">
    <div class="row align-items-center g-3">
      <div class="col-12 col-lg-7">
        <h1 class="h3 mb-2">Готово! Каркас Gemini Chat</h1>
        <p class="text-secondary mb-3">
          Это минимальная основа чата на Vue 3 + TypeScript. Перейдите во вкладку
          <RouterLink class="link-underline link-underline-opacity-50" :to="{ name: 'chat' }">Чат</RouterLink>
          чтобы протестировать UI и добавить свою логику обращения к Gemini API.
        </p>
        <ul class="list-unstyled mb-0">
          <li class="mb-1">• Настройки: API-ключ, выбор модели</li>
          <li class="mb-1">• Список сообщений (user / model)</li>
          <li class="mb-1">• Поле ввода + кнопка «Отправить»</li>
          <li class="mb-1">• Сброс истории</li>
        </ul>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card bg-dark border-secondary-subtle">
          <div class="card-body">
            <h2 class="h5">Быстрый старт</h2>
            <ol class="mb-0">
              <li>Откройте раздел «Чат»</li>
              <li>Вставьте API-ключ</li>
              <li>Выберите модель</li>
              <li>Отправьте сообщение</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>


