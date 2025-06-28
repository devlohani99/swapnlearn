import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const allSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'UI/UX', 'Data Science',
  'Machine Learning', 'Public Speaking', 'Writing', 'Photography', 'Cooking'
];

const SkillSelection = () => {
  const token = useAuthStore((state) => state.token);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const navigate = useNavigate();
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillstoLearn, setSkillstoLearn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skillsToTeach, skillstoLearn }),
      }
    );
    setLoading(false);
    if (res.ok) {
      await fetchProfile();
      navigate('/profile');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to update skills');
    }
  };

  const toggleSkill = (skill, list, setList) => {
    setList(list.includes(skill) ? list.filter(s => s !== skill) : [...list, skill]);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Select Your Skills</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Skills you can teach:</h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <button
                type="button"
                key={skill}
                className={`px-3 py-1 rounded border ${skillsToTeach.includes(skill) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                onClick={() => toggleSkill(skill, skillsToTeach, setSkillsToTeach)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Skills you want to learn:</h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <button
                type="button"
                key={skill}
                className={`px-3 py-1 rounded border ${skillstoLearn.includes(skill) ? 'bg-green-500 text-white' : 'bg-white'}`}
                onClick={() => toggleSkill(skill, skillstoLearn, setSkillstoLearn)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Skills'}
        </button>
        {message && <div className="text-red-500">{message}</div>}
      </form>
    </div>
  );
};

export default SkillSelection;