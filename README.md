# galaxy-mahjong

<https://minori-akizuki.github.io/Galaxy_Mahjong/>

[銀河麻雀](https://youtu.be/IDaKM7eU7zE) という麻雀ルールの待ち牌解析ができるページです。
麻雀ルール部分は後々 NPM に切り出す予定ですが、現在は全て `lib` ディレクトリに入っています。
麻雀ゲームとか作りたい人はフォークしてそこだけ切り出すのもアリです。

## CI/CD

GitHub Actions によって CI/CD が組まれています。

* main 以外への branch への push
  * UT が自動的に走ります。カバレッジも表示されますが、表示されるだけです。

* main への merge
  * <https://minori-akizuki.github.io/Galaxy_Mahjong/> にページがデプロイされます

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Run your unit tests

```bash
npm run test:unit
npm run test:unit-cov
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
