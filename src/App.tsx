import React, { useState, useEffect } from 'react';
import { api } from './api';
import {
  UserProfile,
  CareerRecommendation,
  MarketOverview,
  MarketChartData,
  SkillLeaderboardItem,
  SkillGapAnalysis,
} from './types';
import { AppLayout } from './components/common/AppLayout';
import { UserOnboardingFlow } from './components/onboarding/UserOnboardingFlow';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { MyCareerPathway } from './components/career/MyCareerPathway';
import { CareerDetailPage } from './components/career/CareerDetailPage';
import { SkillGapPage } from './components/skillgap/SkillGapPage';
import { LearningRoadmapPage } from './components/future/LearningRoadmapPage';
import { JobMarketPage } from './components/market/JobMarketPage';
import { SkillsIntelligencePage } from './components/skills/SkillsIntelligencePage';
import { ProfilePage } from './components/profile/ProfilePage';

// AI Modules
import { AssessmentTest } from './components/assessment/AssessmentTest';
import { AIMockInterview } from './components/interview/AIMockInterview';
import { CareerIQChatbot } from './components/chatbot/CareerIQChatbot';

import { AssessmentResult } from './lib/assessment/scoring';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('careeriq_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<any>('dashboard');
  const [selectedCareerDetailRole, setSelectedCareerDetailRole] = useState<string | null>(null);

  const [showMockTest, setShowMockTest] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const [lastTestResult, setLastTestResult] = useState<AssessmentResult | null>(null);
  const [lastInterviewResult, setLastInterviewResult] = useState<{ overallScore: number; weaknesses: string[] } | null>(null);

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [marketCharts, setMarketCharts] = useState<MarketChartData | null>(null);
  const [skillsLeaderboard, setSkillsLeaderboard] = useState<SkillLeaderboardItem[]>([]);
  const [skillGapData, setSkillGapData] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadIntelligence() {
      setIsLoading(true);
      try {
        const [fetchedRecs, fetchedMarketOverview, fetchedMarketCharts, fetchedSkills, fetchedSkillGap] =
          await Promise.all([
            api.career.getRecommendations(),
            api.market.getOverview(),
            api.market.getMarketCharts(),
            api.skills.getLeaderboard(),
            api.career.getSkillGapAnalysis(user?.targetRole || 'Data Scientist'),
          ]);
        setRecommendations(fetchedRecs);
        setMarketOverview(fetchedMarketOverview);
        setMarketCharts(fetchedMarketCharts);
        setSkillsLeaderboard(fetchedSkills);
        setSkillGapData(fetchedSkillGap);
      } catch (err) {
        console.error('Failed to load CareerIQ intelligence data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadIntelligence();
  }, [user?.targetRole]);

  const handleProfileCompleted = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('careeriq_active_user', JSON.stringify(newUser));
    setCurrentTab('dashboard');
  };

  const handleTargetRoleChange = async (newRole: string) => {
    if (user) {
      const updated = { ...user, targetRole: newRole };
      setUser(updated);
      localStorage.setItem('careeriq_active_user', JSON.stringify(updated));
    }
    try {
      const updatedGap = await api.career.getSkillGapAnalysis(newRole);
      setSkillGapData(updatedGap);
    } catch {}
  };

  const handleNewProfile = () => {
    setUser(null);
    localStorage.removeItem('careeriq_active_user');
    setSelectedCareerDetailRole(null);
    setLastTestResult(null);
    setLastInterviewResult(null);
  };

  const handleTabSelect = (tab: any) => {
    if (tab === 'assistant') {
      setShowAssistant(true);
      return;
    }
    if (tab === 'mock-test') {
      setShowMockTest(true);
      return;
    }
    if (tab === 'mock-interview') {
      setShowMockInterview(true);
      return;
    }
    if (tab === 'settings') {
      return; // Not fully implemented yet
    }
    setSelectedCareerDetailRole(null);
    setCurrentTab(tab);
  };

  if (!user) {
    return <UserOnboardingFlow onProfileCompleted={handleProfileCompleted} />;
  }

  if (showMockTest) {
    return (
      <AssessmentTest
        role={user.targetRole}
        onClose={() => setShowMockTest(false)}
        onComplete={(res) => setLastTestResult(res)}
      />
    );
  }

  if (showMockInterview) {
    return (
      <AIMockInterview
        defaultRole={user.targetRole}
        user={user}
        onClose={() => setShowMockInterview(false)}
      />
    );
  }

  const selectedCareer = selectedCareerDetailRole
    ? recommendations.find(r => r.role.toLowerCase() === selectedCareerDetailRole.toLowerCase() || r.id === selectedCareerDetailRole) || recommendations[0]
    : null;

  return (
    <AppLayout
      currentTab={currentTab}
      onSelectTab={handleTabSelect}
      user={user}
      onNewProfile={handleNewProfile}
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {selectedCareer ? (
          <CareerDetailPage
            career={selectedCareer}
            user={user}
            onBack={() => setSelectedCareerDetailRole(null)}
            onNavigateSkillGap={role => {
              handleTargetRoleChange(role);
              setSelectedCareerDetailRole(null);
              setCurrentTab('skill-gap');
            }}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <OverviewDashboard
                user={user}
                recommendations={recommendations}
                marketOverview={marketOverview}
                onSelectRole={setSelectedCareerDetailRole}
                onNavigateTab={handleTabSelect}
                onTakeAssessment={() => setShowMockTest(true)}
                onStartInterview={() => setShowMockInterview(true)}
                assessmentScore={lastTestResult?.overallScore ?? null}
              />
            )}

            {currentTab === 'career-paths' && (
              <MyCareerPathway
                currentRole={user.currentRole}
                targetRole={user.targetRole}
                recommendations={recommendations}
                onSelectRole={setSelectedCareerDetailRole}
              />
            )}

            {currentTab === 'skill-gap' && (
              <SkillGapPage
                user={user}
                targetRole={user.targetRole}
                onTargetRoleChange={handleTargetRoleChange}
                onCreateRoadmap={() => setCurrentTab('learning')}
              />
            )}

            {currentTab === 'learning' && (
              <LearningRoadmapPage targetRole={user.targetRole} />
            )}

            {currentTab === 'job-market' && marketOverview && marketCharts && (
              <JobMarketPage overview={marketOverview} chartData={marketCharts} />
            )}

            {currentTab === 'skills' && (
              <SkillsIntelligencePage
                skillsLeaderboard={skillsLeaderboard}
                onNavigateSkillGap={() => setCurrentTab('skill-gap')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfilePage
                user={user}
                onUpdateProfile={updated => {
                  setUser(updated);
                  localStorage.setItem('careeriq_active_user', JSON.stringify(updated));
                  if (updated.targetRole !== user.targetRole) handleTargetRoleChange(updated.targetRole);
                }}
                onOpenUploadResume={handleNewProfile}
              />
            )}
          </>
        )}
      </div>

      <CareerIQChatbot
        user={user}
        testResult={lastTestResult ? { totalScore: lastTestResult.overallScore, weakSkills: lastTestResult.weakSkills } : null}
        interviewResult={lastInterviewResult}
        isOpenOverride={showAssistant}
        onToggleOverride={setShowAssistant}
      />
    </AppLayout>
  );
}

export default App;
