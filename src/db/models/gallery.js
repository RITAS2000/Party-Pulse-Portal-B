import { model, Schema } from 'mongoose';

const galleryCharacterSchema = new Schema(
  {
    originalCharId: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true,
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    nickname: { type: String, required: true },
    race: {
      type: String,
      required: true,
    },
    level: { type: Number, required: true },
    avatar: { type: String },
    server: { type: String },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GalleryCharacters = model(
  'GalleryCharacter',
  galleryCharacterSchema,
);
// Видалити копію з галереї будь-коли
// app.delete("/gallery/remove/:id", auth, async (req, res) => {
//   const entry = await GalleryCollection.findById(req.params.id);

//   if (!entry) return res.status(404).json({ message: "Gallery entry not found" });
//   if (entry.userId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

//   await entry.remove();
//   res.json({ message: "Gallery entry removed" });
// });
// {
//   galleryEntries.map((entry) => (
//     <div key={entry._id} className="flex items-center gap-4">
//       <p>{entry.nickname}</p>
//       <button
//         className="text-red-600 hover:text-red-800"
//         onClick={() => removeFromGallery(entry._id)}
//       >
//         Видалити
//       </button>
//       {entry.isApproved && <span className="text-green-600">Підтверджено</span>}
//     </div>
//   ));
// }

// const removeFromGallery = async (id: string) => {
//   await fetch(`/gallery/remove/${id}`, { method: 'DELETE' });
//   setGalleryEntries((prev) => prev.filter((e) => e._id !== id));
// };
