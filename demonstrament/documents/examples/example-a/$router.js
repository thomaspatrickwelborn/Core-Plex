export default {
  active: true,
  name: 'Index',
  path: '/examples/example-a',
  source: 'documents/examples/example-a',
  target: 'localhost/examples/example-a',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}