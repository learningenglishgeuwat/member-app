import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_PHYSICAL_APPEARANCE_WORDS } from '../../data/words/physical-appearance';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('physical-appearance');

export default function VocabularyPhysicalAppearancePage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_PHYSICAL_APPEARANCE_WORDS} />;
}
