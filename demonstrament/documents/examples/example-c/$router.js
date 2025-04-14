export default {
  active: true,
  name: 'Index',
  path: '/examples/example-c',
  source: 'documents/examples/example-c',
  target: 'localhost/examples/example-c',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}