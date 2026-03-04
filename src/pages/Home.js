import React from "react";
import { useAuth } from "../contexts/AuthContext";
import QuickActionCard from "../components/QuickActionCard";
import InfoItem from "../components/InfoItem";

function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sps-600 to-sps-800 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.name || "Usuário"}! 👋
          </h1>
          <p className="text-sps-200 text-lg">
            Painel de administração do SPS System
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Usuários"
          description="Gerenciar usuários do sistema"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
          href="/users"
          color="sps"
        />
        <QuickActionCard
          title="Documentação"
          description="API Docs via Swagger"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          href={`${process.env.REACT_APP_SERVER_URL}/api-docs`}
          external
          color="emerald"
        />
        <QuickActionCard
          title="Perfil"
          description={`Tipo: ${user?.type || "N/A"}`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="amber"
        />
      </div>

      {/* Info Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Informações do Sistema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <InfoItem label="Usuário" value={user?.name} />
          <InfoItem label="E-mail" value={user?.email} />
          <InfoItem label="Tipo" value={user?.type} />
        </div>
      </div>
    </div>
  );
}

export default Home;
