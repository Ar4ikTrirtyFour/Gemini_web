<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <span class="navbar-brand fw-semibold">Gemini Vue TS</span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto gap-2">
          <li class="nav-item">
            <RouterLink class="btn btn-outline-light" to="/">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="btn btn-primary" to="/chat">Чат</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container my-3">
    <RouterView />
  </main>

  <footer class="border-top border-secondary-subtle mt-4 py-3">
    <div class="container text-secondary small">
      Gemini Chat UI (Vue 3 + TS)
    </div>
  </footer>

</template>

<script setup lang="ts"></script>

<style scoped></style>
