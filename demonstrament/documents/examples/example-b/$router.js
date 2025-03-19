export default {
  active: true,
  name: 'Index',
  path: '/examples/example-b',
  source: 'documents/examples/example-b',
  target: 'localhost/examples/example-b',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}