const accessLogSchema = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});

module.exports = server => {
    server.use(logger('combined', {stream: accessLogSchema}));
}