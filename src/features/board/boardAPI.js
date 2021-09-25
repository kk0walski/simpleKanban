import createWelcomeBoard from './createWelcomeBoard';

export function fetchBoard(id = 1) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({data: createWelcomeBoard(id)}), 500)
    );
  }
  