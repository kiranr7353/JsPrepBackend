const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const app = express();

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoriesTopicsRoutes');
const conceptRoutes = require('./routes/conceptsRoutes');
const snippetsRoutes = require('./routes/snippetsRoutes');
const programmingRoutes = require('./routes/programmingRoutes');

dotenv.config();



app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/concepts', conceptRoutes);
app.use('/api/v1/snippets', snippetsRoutes);
app.use('/api/v1/programmingQA', programmingRoutes);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Looks good!!</h1>")
})

const PORT = process.env.PORT || 8082;

app.listen(PORT), () => {
    console.log('Server running');
}