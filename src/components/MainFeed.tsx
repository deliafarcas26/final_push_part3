import React, { useState, useEffect } from "react";
import img_ag from "url:../images/poza_ag.jpg";
import { INITIAL_AVATAR_URL } from "./Profile";

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  authorAvatarUrl?: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  authorAvatarUrl?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

interface PostCreatorProps {
  onNewPost: (postData: { content: string; file: File | null }) => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onNewPost }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setPostError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);

    if (!postContent.trim() && !selectedFile) {
      setPostError("Vă rugăm adăugați conținut sau o imagine pentru a posta.");
      return;
    }

    setIsPosting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onNewPost({ content: postContent, file: selectedFile });

      alert("Postare adăugată local în feed!");

      setPostContent("");
      setSelectedFile(null);
    } catch (error) {
      setPostError("A apărut o eroare necunoscută la adăugarea postării.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-primary-200">
      <h3 className="text-xl font-bold text-primary-700 mb-4">Ce este nou?</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 mb-3 resize-none"
          rows={3}
          placeholder="Scrieți o actualizare sau un anunț..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          disabled={isPosting}
        />

        {postError && (
          <p className="text-red-500 text-sm mb-3 font-medium border border-red-200 bg-red-50 p-2 rounded">
            {postError}
          </p>
        )}

        <div className="flex justify-between items-center mt-3">
          <div>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isPosting}
            />
            <label
              htmlFor="file-upload"
              className={`px-3 py-1 text-sm rounded-full transition-colors cursor-pointer ${
                isPosting
                  ? "bg-gray-200 text-gray-500"
                  : "bg-primary-100 text-primary-700 hover:bg-primary-200"
              }`}
            >
              {selectedFile ? selectedFile.name : "Adaugă Foto/Video"}
            </label>
          </div>

          <button
            type="submit"
            className={`px-5 py-2 font-semibold text-white rounded-lg transition-colors shadow-md ${
              isPosting
                ? "bg-primary-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={isPosting || (!postContent.trim() && !selectedFile)}
          >
            {isPosting ? "Se postează..." : "Postează"}
          </button>
        </div>
      </form>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: number) => void;
  onCommentSubmit: (postId: number, content: string) => void;
  onDelete?: (postId: number) => void;
  canDelete?: boolean;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex space-x-2 p-2 mt-2 bg-gray-50 rounded-lg">
    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
      {comment.author.charAt(0)}
    </div>
    <div className="text-sm">
      <p className="font-semibold text-gray-800">
        {comment.author}{" "}
        <span className="text-xs font-normal text-gray-500 ml-2">
          {comment.timestamp}
        </span>
      </p>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  </div>
);

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeToggle,
  onCommentSubmit,
  onDelete,
  canDelete,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(post.id, commentText);
      setCommentText("");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Sigur doriți să ștergeți această postare?")) {
      onDelete?.(post.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold mr-3">
              {post.author.charAt(0)}
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900">{post.author}</p>
            <span className="text-sm text-gray-500">{post.timestamp}</span>
          </div>
        </div>

        {canDelete && onDelete && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Șterge postarea"
            aria-label="Șterge postarea"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post media"
          className="rounded-lg w-full h-auto object-cover max-h-96 mt-3"
        />
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 mt-3 border-b pb-2 border-gray-100">
        <span>
          {post.likes > 0 && (
            <span>
              👍 {post.likes} {post.likes === 1 ? "Like" : "Like-uri"}
            </span>
          )}
        </span>
        <span>
          {post.comments.length > 0 && (
            <span>
              {post.comments.length}{" "}
              {post.comments.length === 1 ? "Comentariu" : "Comentarii"}
            </span>
          )}
        </span>
      </div>

      <div className="flex space-x-4 border-t border-gray-100 mt-2 pt-3 text-sm text-gray-600 font-semibold">
        <button
          onClick={() => onLikeToggle(post.id)}
          className={`flex-1 hover:text-primary-600 transition-colors ${
            post.isLiked ? "text-primary-600" : "text-gray-600"
          }`}
        >
          {post.isLiked ? "❤️ Apreciat" : "🤍 Apreciază"}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 hover:text-primary-600 transition-colors"
        >
          💬 Comentează
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-2 border-t border-gray-100">
          <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Adaugă un comentariu..."
              className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className={`px-4 py-2 text-white text-sm rounded-lg transition-colors font-semibold ${
                !commentText.trim()
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              Trimite
            </button>
          </form>

          <div className="space-y-2">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Fii primul care comentează!
              </p>
            ) : (
              post.comments
                .map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
                .reverse()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Andrei Guinea",
    content: "Sybau.",
    timestamp: "Acum 5 minute",
    imageUrl: img_ag,
    authorAvatarUrl: "https://picsum.photos/50/50?random=10",
    likes: 5,
    isLiked: false,
    comments: [
      {
        id: 101,
        author: "Maria Ionescu",
        content: "Felicitări pentru lansare!",
        timestamp: "5m",
        authorAvatarUrl: "URL_MARIA",
      },
      {
        id: 102,
        author: "Alin Durlac",
        content: "Vii la o??",
        timestamp: "2m",
        authorAvatarUrl: INITIAL_AVATAR_URL,
      },
    ],
  },
  {
    id: 2,
    author: "Delia Farcas",
    content:
      "Sesiunea de training React Native a fost super productivă azi! Ne vedem săptămâna viitoare pentru partea a II-a.",
    timestamp: "Acum 1 oră",
    authorAvatarUrl: INITIAL_AVATAR_URL,
    likes: 12,
    isLiked: true,
    comments: [],
  },
];

const MainFeed: React.FC = () => {
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const loadPostsFromStorage = (): Post[] => {
    try {
      const stored = localStorage.getItem("feedPosts");
      if (stored) {
        const parsedPosts = JSON.parse(stored) as Post[];
        const initialPostIds = new Set(initialPosts.map((p) => p.id));
        const userPosts = parsedPosts.filter((p) => !initialPostIds.has(p.id));
        return [...initialPosts, ...userPosts];
      }
    } catch (error) {
      console.error("Eroare la încărcarea postărilor din localStorage:", error);
    }
    return initialPosts;
  };

  const savePostsToStorage = (postsToSave: Post[]) => {
    try {
      const initialPostIds = new Set(initialPosts.map((p) => p.id));
      const userPosts = postsToSave.filter((p) => !initialPostIds.has(p.id));
      localStorage.setItem("feedPosts", JSON.stringify(userPosts));
    } catch (error) {
      console.error("Eroare la salvarea postărilor în localStorage:", error);
    }
  };

  const [posts, setPosts] = useState<Post[]>(() => loadPostsFromStorage());

  useEffect(() => {
    savePostsToStorage(posts);
  }, [posts]);

  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.name || "Utilizator";
      } catch (error) {
        console.error("Eroare la citirea utilizatorului:", error);
        return "Utilizator";
      }
    }
    return "Utilizator";
  };

  const handleNewPost = async ({
    content,
    file,
  }: {
    content: string;
    file: File | null;
  }) => {
    let imageUrl: string | undefined = undefined;

    if (file) {
      try {
        imageUrl = await fileToBase64(file);
      } catch (error) {
        console.error("Eroare la convertirea imaginii:", error);
        imageUrl = URL.createObjectURL(file);
      }
    }

    const newPost: Post = {
      id: Date.now(),
      author: getCurrentUser(),
      content: content,
      timestamp: "Chiar acum",
      imageUrl: imageUrl,
      authorAvatarUrl: INITIAL_AVATAR_URL,
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLikeToggle = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleCommentSubmit = (postId: number, content: string) => {
    const newComment: Comment = {
      id: Date.now() + Math.random(),
      author: getCurrentUser(),
      content: content,
      timestamp: "1s",
      authorAvatarUrl: INITIAL_AVATAR_URL,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const handleDeletePost = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const canUserDeletePost = (post: Post): boolean => {
    const currentUser = getCurrentUser();
    if (post.id === 1 || post.id === 2) {
      return false;
    }
    return post.author === currentUser;
  };

  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Flux Principal</h1>

      <PostCreator onNewPost={handleNewPost} />

      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLikeToggle={handleLikeToggle}
            onCommentSubmit={handleCommentSubmit}
            onDelete={handleDeletePost}
            canDelete={canUserDeletePost(post)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
