import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    let { sort, page, limit } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    const posts = await PostModel.find()
      .sort(`${sort}`)
      .skip(`${offset}`)
      .limit(`${limit}`)
      .populate('user')
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Не вдалось отримати статті!',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: 'Не вдалось повернути статтю!',
          });
        }

        if (!doc) {
          return res.status(404).json({
            msg: 'Стаття не знайдена!',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Не вдалось отримати статтЮ!',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: 'Не вдалось видалити статтю!',
          });
        }

        if (!doc) {
          return res.status(404).json({
            msg: 'Стаття не знайдена!',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {}
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Не вдалось створити статтю!',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Не вдалось обновити статтю!',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'Не вдалось отримати статті!',
    });
  }
};
