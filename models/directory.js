import mongoose from 'mongoose';

const { Schema } = mongoose;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Directory', // Refers to the same model for folders
    default: null,
  },
   children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Directory', // Recursive reference for nested folders/files
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove `children` field for files before saving
// fileSchema.pre('save', function(next) {
//   if (this.type === 'file') {
//     this.children = undefined;
//   }
//   next();
// });

fileSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
});

const Directory = mongoose.model('Directory', fileSchema);

export default Directory;
