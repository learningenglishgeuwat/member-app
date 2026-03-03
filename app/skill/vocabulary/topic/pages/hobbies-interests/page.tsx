import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_HOBBIES_INTERESTS_WORDS } from '../../data/words/hobbies-interests';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('hobbies-interests');

export default function VocabularyHobbiesInterestsPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_HOBBIES_INTERESTS_WORDS} />;
}
